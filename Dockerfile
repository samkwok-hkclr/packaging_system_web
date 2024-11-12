FROM node:18-alpine AS packaging_test_web_img

ENV PROJECT_NAME=packaging_test_web
RUN mkdir -p /${PROJECT_NAME}

WORKDIR /${PROJECT_NAME}

COPY . /${PROJECT_NAME}

RUN npm install

EXPOSE 8000 

CMD ["npm", "run", "dev", "--", "--host", "--port", "8080"]