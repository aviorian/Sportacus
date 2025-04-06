#!/bin/bash
if [ ! -f .env ]; then
    echo ".env file created from .envExample" 
    cp .envExample .env
else
  echo ".env file already exists."
fi