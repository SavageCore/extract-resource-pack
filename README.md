# Extract Resource Pack

[![Mac/Linux build  Status](https://travis-ci.org/SavageCore/extract-resource-pack.svg?branch=master)](https://travis-ci.org/SavageCore/extract-resource-pack) [![Windows build status](https://ci.appveyor.com/api/projects/status/24p14t1j52ee5kaw?svg=true)](https://ci.appveyor.com/project/SavageCore/extract-resource-pack) [![GitHub license](https://img.shields.io/badge/license-Unlicense-blue.svg)](https://raw.githubusercontent.com/SavageCore/extract-resource-pack/master/LICENSE.md) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo) [![Dependencies Status](https://david-dm.org/SavageCore/extract-resource-pack/status.svg)](https://david-dm.org/SavageCore/extract-resource-pack)

Simple tool to extract default resource pack from a Minecraft jar.

## Usage
1. Download latest Minecraft client jar [here](https://mcversions.net/)
1. Download and extract [latest release](https://github.com/SavageCore/extract-resource-pack/releases/latest)
1. Edit pack.mcmeta and pack.png in assets folder
	1. `pack_format 3` is for 1.11+, use `2` for 1.10 [[More info](http://minecraft.gamepedia.com/Tutorials/Creating_a_resource_pack#pack.mcmeta)]
1. Launch app
1. Drag and drop client jar on to window
1. Generated zip can be found in assets folder
