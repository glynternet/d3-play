serve:
	http-server -p8889

push:
	aws s3 sync --delete  ./ s3://glynternet  --exclude ".git/*"
