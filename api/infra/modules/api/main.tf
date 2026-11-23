# Append-only log of events; the full state is rebuilt by replaying events in order
resource "aws_dynamodb_table" "events" {
  name         = "${var.name}-events"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "stream_id"
  range_key    = "event_id"

  attribute {
    name = "stream_id"
    type = "S"
  }

  attribute {
    name = "event_id"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }
}

# Packages the compiled executable, which the provided.al2023 runtime expects to be named bootstrap
data "archive_file" "function" {
  type        = "zip"
  source_file = "${var.build_dir}/bootstrap"
  output_path = "${path.module}/function.zip"
}

# Lets Lambda assume the function's role
data "aws_iam_policy_document" "assume" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# Role the function runs as
resource "aws_iam_role" "function" {
  name               = var.name
  assume_role_policy = data.aws_iam_policy_document.assume.json
}

# Allows the function to write its logs
resource "aws_iam_role_policy_attachment" "logs" {
  role       = aws_iam_role.function.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Limits the function to reading and appending events; there is deliberately no update or delete access
data "aws_iam_policy_document" "events_access" {
  statement {
    actions   = ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:Query"]
    resources = [aws_dynamodb_table.events.arn]
  }
}

# Attaches the events table access to the function's role
resource "aws_iam_role_policy" "events_access" {
  name   = "events-access"
  role   = aws_iam_role.function.id
  policy = data.aws_iam_policy_document.events_access.json
}

# Keeps logs for a bounded time instead of forever
resource "aws_cloudwatch_log_group" "function" {
  name              = "/aws/lambda/${var.name}"
  retention_in_days = var.log_retention_days
}

# The API itself, a Go executable on the arm64 custom runtime
resource "aws_lambda_function" "api" {
  function_name    = var.name
  role             = aws_iam_role.function.arn
  runtime          = "provided.al2023"
  architectures    = ["arm64"]
  handler          = "bootstrap"
  filename         = data.archive_file.function.output_path
  source_code_hash = data.archive_file.function.output_base64sha256
  timeout          = 10
  memory_size      = 128

  environment {
    variables = {
      EVENTS_TABLE = aws_dynamodb_table.events.name
    }
  }

  depends_on = [aws_cloudwatch_log_group.function, aws_iam_role_policy_attachment.logs]
}

# Public HTTPS endpoint for the API; guests identify themselves by phone number, not AWS credentials
resource "aws_lambda_function_url" "api" {
  function_name      = aws_lambda_function.api.function_name
  authorization_type = "NONE"

  cors {
    allow_origins = var.cors_allowed_origins
    allow_methods = ["GET", "POST", "PUT", "DELETE"]
    allow_headers = ["content-type"]
    max_age       = 86400
  }
}

# Public Function URLs need both of these permissions to be invokable
resource "aws_lambda_permission" "url_invoke" {
  statement_id           = "AllowPublicFunctionUrl"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = aws_lambda_function.api.function_name
  principal              = "*"
  function_url_auth_type = "NONE"
}

# Second permission required for Function URL invocation
resource "aws_lambda_permission" "url_invoke_function" {
  statement_id             = "AllowPublicFunctionUrlInvoke"
  action                   = "lambda:InvokeFunction"
  function_name            = aws_lambda_function.api.function_name
  principal                = "*"
  invoked_via_function_url = true
}
