# Update the VARIANT arg in docker-compose.yml to pick a Node version: 10, 12, 14
ARG VARIANT=16
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}


# Install MongoDB command line tools if on buster and x86_64 (arm64 not supported)
ARG MONGO_TOOLS_VERSION=5.0
RUN . /etc/os-release \
    && if [ "${VERSION_CODENAME}" = "buster" ] && [ "$(dpkg --print-architecture)" = "amd64" ]; then \
        curl -sSL "https://www.mongodb.org/static/pgp/server-${MONGO_TOOLS_VERSION}.asc" | gpg --dearmor > /usr/share/keyrings/mongodb-archive-keyring.gpg \
        && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg] http://repo.mongodb.org/apt/debian $(lsb_release -cs)/mongodb-org/${MONGO_TOOLS_VERSION} main" | tee /etc/apt/sources.list.d/mongodb-org-${MONGO_TOOLS_VERSION}.list \
        && apt-get update && export DEBIAN_FRONTEND=noninteractive \
        && apt-get install -y mongodb-database-tools mongodb-mongosh \
        && apt-get clean -y && rm -rf /var/lib/apt/lists/*; \
    fi
# Update args in docker-compose.yaml to set the UID/GID of the "node" user.
ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN if [ "$USER_GID" != "1000" ] || [ "$USER_UID" != "1000" ]; then groupmod --gid $USER_GID node && usermod --uid $USER_UID --gid $USER_GID node; fi




