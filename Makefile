run:
	docker run -d -p 1010:1010 -p 2020:2020 -v /home/bot/unibot/files:/src/files -v /home/bot/unibot/config:/src/config unibot:latest
build:
	docker build -t unibot:latest .
rm_image:
	docker image rm unibot:latest