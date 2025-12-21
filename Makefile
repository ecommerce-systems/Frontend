# Makefile for the React project

# Install dependencies
install:
	npm install

# Start the development server
dev:
	npm run dev

# Build the project for production
build:
	npm run build

# Install dependencies and build the project
all: install build

.PHONY: install dev build all
