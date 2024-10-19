# Stage 1: Build the Next.js frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Install Python and build dependencies
RUN apk add --no-cache python3 make g++ linux-headers

# Set Python path for node-gyp
ENV PYTHON=/usr/bin/python3

COPY package*.json ./
# Install dependencies, excluding the problematic 'usb' package
RUN npm ci --ignore-scripts && npm rm usb && npm i

COPY . .
RUN npm run build

# Stage 2: Set up the Python backend
FROM python:3.11-alpine AS backend-builder

WORKDIR /app/api

# Install only necessary build dependencies
RUN apk add --no-cache gcc musl-dev

# Create and activate virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY api .

# Stage 3: Final image
FROM node:18-alpine

WORKDIR /app

# Install Python and other necessary dependencies
RUN apk add --no-cache python3 py3-pip

# Copy the built Next.js frontend
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder /app/package*.json ./
COPY --from=frontend-builder /app/next.config.js ./

# Copy the Python backend and virtual environment
COPY --from=backend-builder /app/api /app/api
COPY --from=backend-builder /opt/venv /opt/venv

# Set up environment to use Python virtual environment
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONPATH="/app/api:$PYTHONPATH"

# Install production dependencies excluding usb
RUN npm ci --only=production --ignore-scripts && \
    npm rm usb && \
    npm i --only=production

# Expose ports for Next.js and FastAPI
EXPOSE 3000 8000

# Use npm to start both services
CMD ["npm", "run", "start:docker"]
