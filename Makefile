PACKAGE_NAME := io.alde.examples.TodoApp
PACKAGE_VERSION := 1.0
ENTRY_POINT_NAME := $(PACKAGE_NAME)
ENTRY_POINT_PATH := /$(subst .,/,$(ENTRY_POINT_NAME))

GJS ?= $(shell which gjs)
PREFIX ?= /usr/local
DATADIR ?= $(PREFIX)/share
LIBDIR ?= $(PREFIX)/lib64

PKGLIBDIR ?= $(LIBDIR)/$(PACKAGE_NAME)
PKGDATADIR ?= $(DATADIR)/$(PACKAGE_NAME)

export

.PHONY: all entrypoint src-resources data-resources clean

all: entrypoint src-resources data-resources

ENTRY_POINT = src/$(ENTRY_POINT_NAME)
entrypoint: $(ENTRY_POINT)
$(ENTRY_POINT): % : %.in
	envsubst < $< > $@ && chmod 0755 $@

SRC_RESOURCE = src/$(PACKAGE_NAME).src.gresource
src-resources: $(SRC_RESOURCE)
$(SRC_RESOURCE): $(wildcard src/*.js)

DATA_RESOURCE = data/$(PACKAGE_NAME).data.gresource
data-resources: $(DATA_RESOURCE)
$(DATA_RESOURCE): $(wildcard data/*.ui)

%.gresource: %.gresource.xml
	glib-compile-resources --sourcedir=$(@D) $<

clean:
	rm -f $(ENTRY_POINT)
	rm -f $(SRC_RESOURCE)
	rm -f $(DATA_RESOURCE)
