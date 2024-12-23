FROM madnificent/ember:5.12.0 AS builder

LABEL maintainer="info@redpencil.io"

WORKDIR /app
COPY package.json .
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM semtech/static-file-service:0.2.0

COPY nginx/app.conf /config/app.conf
COPY --from=builder /app/dist /data
