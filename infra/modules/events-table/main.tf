# Append-only log of events; the full state is rebuilt by replaying events in order
resource "aws_dynamodb_table" "events" {
  name         = var.table_name
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
