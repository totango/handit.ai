# Helm operations for Handit.ai

CHART_NAME := handit-ai
CHART_PATH := ./$(CHART_NAME)
NAMESPACE_DEV := handit-dev
NAMESPACE_PROD := handit-prod

.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make lint         - Lint the Helm chart"
	@echo "  make template-dev - Generate Kubernetes manifests for dev"
	@echo "  make template-prod - Generate Kubernetes manifests for prod"
	@echo "  make install-dev  - Install/upgrade in development"
	@echo "  make install-prod - Install/upgrade in production"
	@echo "  make uninstall-dev - Uninstall from development"
	@echo "  make uninstall-prod - Uninstall from production"
	@echo "  make dry-run-dev  - Dry run installation for dev"
	@echo "  make dry-run-prod - Dry run installation for prod"

.PHONY: lint
lint:
	helm lint $(CHART_PATH)
	helm lint $(CHART_PATH) -f $(CHART_PATH)/values-dev.yaml
	helm lint $(CHART_PATH) -f $(CHART_PATH)/values-prod.yaml

.PHONY: template-dev
template-dev:
	helm template $(CHART_NAME)-dev $(CHART_PATH) \
		-f $(CHART_PATH)/values-dev.yaml \
		--namespace $(NAMESPACE_DEV)

.PHONY: template-prod
template-prod:
	helm template $(CHART_NAME)-prod $(CHART_PATH) \
		-f $(CHART_PATH)/values-prod.yaml \
		--namespace $(NAMESPACE_PROD)

.PHONY: install-dev
install-dev:
	helm upgrade --install $(CHART_NAME)-dev $(CHART_PATH) \
		-f $(CHART_PATH)/values-dev.yaml \
		--namespace $(NAMESPACE_DEV) \
		--create-namespace \
		--wait

.PHONY: install-prod
install-prod:
	@echo "⚠️  WARNING: You are about to deploy to PRODUCTION!"
	@echo "Press Ctrl+C to cancel, or Enter to continue..."
	@read confirm
	helm upgrade --install $(CHART_NAME)-prod $(CHART_PATH) \
		-f $(CHART_PATH)/values-prod.yaml \
		--namespace $(NAMESPACE_PROD) \
		--create-namespace \
		--wait

.PHONY: uninstall-dev
uninstall-dev:
	helm uninstall $(CHART_NAME)-dev --namespace $(NAMESPACE_DEV)

.PHONY: uninstall-prod
uninstall-prod:
	@echo "⚠️  WARNING: You are about to UNINSTALL from PRODUCTION!"
	@echo "Press Ctrl+C to cancel, or Enter to continue..."
	@read confirm
	helm uninstall $(CHART_NAME)-prod --namespace $(NAMESPACE_PROD)

.PHONY: dry-run-dev
dry-run-dev:
	helm install $(CHART_NAME)-dev $(CHART_PATH) \
		-f $(CHART_PATH)/values-dev.yaml \
		--namespace $(NAMESPACE_DEV) \
		--dry-run --debug

.PHONY: dry-run-prod
dry-run-prod:
	helm install $(CHART_NAME)-prod $(CHART_PATH) \
		-f $(CHART_PATH)/values-prod.yaml \
		--namespace $(NAMESPACE_PROD) \
		--dry-run --debug

.PHONY: package
package:
	helm package $(CHART_PATH)

.PHONY: deps
deps:
	helm dependency update $(CHART_PATH)