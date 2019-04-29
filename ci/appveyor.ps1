if ($env:APPVEYOR_REPO_TAG -eq 'True') {
	mkdir out
	cd out
	# git clone https://github.com/electron-userland/electron-forge.git
	# cd electron-forge
	# npm install
	# npm link
	# cd ../..
	git tag --points-at HEAD > tagFile
	Get-Content tagFile | SET /p ctag=
	$ctag = Get-Content .\tagFile -Raw
	echo $ctag
	rm tagFile
	if ($ctag) { electron-forge publish }
} else {
	echo "No tag - skipping build."
}
