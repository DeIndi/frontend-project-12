lint:
	npx eslint .
install:
	npm ci; \
	cd ./frontend/; \
	npm ci;
build:
	npm run build
start:
	npm start
