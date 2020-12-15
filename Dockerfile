FROM madnificent/ember:3.22.0 as builder

LABEL maintainer="info@redpencil.io"

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN ember build -prod

FROM semtech/static-file-service:0.1.0

COPY nginx/app.conf /config/app.conf
COPY --from=builder /app/dist /data
