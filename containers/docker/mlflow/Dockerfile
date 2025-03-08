FROM python:3.9

# Install any apt-dependencies you need here.
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
   	curl gnupg2 apt-transport-https apt-utils ca-certificates \
   	curl dumb-init freetds-bin gnupg gosu ldap-utils locales  \
   	lsb-release netcat openssh-client postgresql-client sasl2-bin sudo \
   	unixodbc build-essential \
	&& apt-get autoremove -yqq --purge \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

# Add any Python requirements.
COPY requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt
