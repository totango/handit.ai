# Helm operations for Handit.ai

CHART_NAME := handit-ai
CHART_PATH := ./$(CHART_NAME)
NAMESPACE_PROD := handit

.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make lint         - Lint the Helm chart"
	@echo "  make template     - Generate Kubernetes manifests for prod"
	@echo "  make install      - Install/upgrade in production"
	@echo "  make uninstall    - Uninstall from production"
	@echo "  make dry-run      - Dry run installation for prod"

.PHONY: lint
lint:
	helm lint $(CHART_PATH)
	helm lint $(CHART_PATH) -f $(CHART_PATH)/values-prod.yaml

.PHONY: template
template:
	helm template $(CHART_NAME) $(CHART_PATH) \
		-f $(CHART_PATH)/values-prod.yaml \
		--namespace $(NAMESPACE_PROD)

.PHONY: install
install:
	@echo "⚠️  WARNING: You are about to deploy to PRODUCTION!"
	@echo "Press Ctrl+C to cancel, or Enter to continue..."
	@read confirm
	helm upgrade --install $(CHART_NAME) $(CHART_PATH) \
		-f $(CHART_PATH)/values-prod.yaml \
		--namespace $(NAMESPACE_PROD) \
		--create-namespace \
		--wait

.PHONY: uninstall
uninstall:
	@echo "⚠️  WARNING: You are about to UNINSTALL from PRODUCTION!"
	@echo "Press Ctrl+C to cancel, or Enter to continue..."
	@read confirm
	helm uninstall $(CHART_NAME) --namespace $(NAMESPACE_PROD)

.PHONY: dry-run
dry-run:
	helm install $(CHART_NAME) $(CHART_PATH) \
		-f $(CHART_PATH)/values-prod.yaml \
		--namespace $(NAMESPACE_PROD) \
		--dry-run --debug

.PHONY: package
package:
	helm package $(CHART_PATH)

.PHONY: deps
deps:
	helm dependency update $(CHART_PATH)