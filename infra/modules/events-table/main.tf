# The events table is retired in favour of the users and components tables.
# Applying this destroys it (it never held data); the module is deleted in a follow-up change.
removed {
  from = aws_dynamodb_table.events

  lifecycle {
    destroy = true
  }
}
