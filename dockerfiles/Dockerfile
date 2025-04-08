# Base image with both Python and Node.js
FROM python:3.11-slim-bookworm

# Install Node.js (LTS version)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Supervisor
RUN apt-get update && apt-get install -y --no-install-recommends \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Set up working directories
WORKDIR /app
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r ./.nanoctl/runtimes/python3/requirements.txt

# Install Node.js dependencies
RUN npm install
# Build the Node.js application
RUN npm run build

# Configure Supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set environment variables
ENV WORKFLOWS_PATH=/app/workflows
ENV CONSOLE_LOG_ACTIVE=true
ENV NODE_ENV=production
ENV APP_NAME=nanoservice-http

# Expose ports (Node.js on 3000, Python on 8000)
EXPOSE 4000/tcp
EXPOSE 9091/tcp

# Start Supervisor
ENTRYPOINT ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf", "-e", "debug"]