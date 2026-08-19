.PHONY: check build preview clean

check:
	python scripts/check_site.py source

build:
	bash scripts/build-site.sh

preview:
	bash scripts/preview-site.sh

clean:
	rm -rf site/_site site/.quarto .quarto
