output "bucket_name" {
  description = "Bucket to sync the built site into (deployment.yml s3-bucket)"
  value       = aws_s3_bucket.site.bucket
}

output "distribution_id" {
  description = "CloudFront distribution to invalidate after upload (deployment.yml cf-distribution)"
  value       = aws_cloudfront_distribution.site.id
}

output "site_url" {
  description = "Public URL of the site"
  value       = "https://${aws_cloudfront_distribution.site.domain_name}"
}
