.DEFAULT_GOAL := help

.PHONY:

export SHELL :=/bin/bash
export UNAME :=$(shell uname)
export OS     =$(UNAME)

# Containerization Parameters
export CONTAINER_BIN          :=docker
export CONTAINER_COMPOSE      :=docker-compose
export DEFAULT_IMAGE_REGISTRY :=docker.io/library/

overleaf_start: overleaf_stop ## start overleaf
	$(CONTAINER_COMPOSE) up -d && \
	$(MAKE) overleaf_create_admin_account

overleaf_stop: ## stop overlearf
	$(CONTAINER_COMPOSE) down; 

overleaf_logs: ## show overleaf logs
	$(CONTAINER_COMPOSE) logs -f sharelatex

# https://github.com/overleaf/overleaf/wiki/Release-Notes--4.x.x#manually-setting-up-mongodb-as-a-replica-set
mongo_fix: ## mongo fix (not working!)
	$(CONTAINER_COMPOSE) exec -it mongo mongo 'rs.initiate({ _id: "overleaf", members: [ { _id: 0, host: "mongo:27017" } ] })'

overleaf_create_admin_account:
	$(CONTAINER_BIN) exec sharelatex /bin/bash -ce "cd /overleaf/services/web && node modules/server-ce-scripts/scripts/create-user --admin --email=joe@example.com"

print-%: ## print a variable and its value, e.g. print the value of variable PROVIDER: make print-PROVIDER
	@echo $* = $($*)

define print-help
$(call print-target-header,"Makefile Help")
	echo
	printf "%s\n" "Makefile targets and their purpose"
	echo
$(call print-target-header,"target                         description")
	grep -E '^([a-zA-Z_-]).+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS=":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' | grep $(or $1,".*")
	echo
endef

help:
	@$(call print-help)

help-%: ## Filtered help, e.g.: make help-terraform
	@$(call print-help,$*)
