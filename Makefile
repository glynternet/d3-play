serve:
	http-server -p8889

push:
	aws s3 --profile=glynternet sync --delete  ./ s3://glynternet  --exclude ".git/*"
