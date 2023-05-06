
create:
	docker-compose up -d
	docker-compose exec client npm install --save --save-exact react react-dom
	docker-compose exec client npm install --save-dev --save-exact vite

up:
	docker-compose up -d
	docker-compose exec client npm install

down: 
	docker-compose down

stop:
	docker stop $$(docker ps -qa)

dev:
	docker-compose exec client npm run development