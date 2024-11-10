# Front-end Dockerfile

FROM oven/bun:latest
WORKDIR /app

# คัดลอกไฟล์ package.json และ bun.lockb
COPY package.json bun.lockb ./

# ติดตั้ง dependencies โดยใช้ Bun
RUN bun install

# คัดลอกไฟล์ทั้งหมดไปยัง container
COPY . .

# เปิดพอร์ต 3000
EXPOSE 3000

# รันแอป Front-end บนพอร์ต 3000
CMD ["bun", "run", "start"]

