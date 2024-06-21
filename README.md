# head-irad-hexagone-tempete-performance
The source code for the performance of Tempest at Théâtre Hexagone, using various forms of AI

- [Isis Fahmy](https://www.isisfahmy.com), Mise en scène, drammaturgie
- [Douglas Edric Stanley](https://abstractmachine.net/fr/biography)
- [Performance à la carte](https://www.theatre-hexagone.eu/spectacle/performances-a-la-carte/), 22 Juin 2024
- [Théâtre Hexagone Scène Nationale](https://www.theatre-hexagone.eu)


## Watch Folder for Building Twee
```
% ./tweego twee -w -o twee.html
```

## Camera
Allumer/Éteindre la caméra avec la touche `DEL`

## Serial Port
Connecter le pilote DMX avec la touche `=`

## Start Luxonis Camera

```
% cd ~/Code/AI/depthai-python/examples/ColorCamera
% python rgb_uvc.py
```

Or directly:

```
% python ~/Code/AI/depthai-python/examples/ColorCamera/rgb_uvc.py
```

## Pilotage DMX

### Lights
Canal #1	on/off	Sycorax	Screen left
Canal #2	on/off	Sycorax Screen right
Canal #3	on/off	Isis Speaking Stage
Canal #4	on/off	Douglas Speaking Stage
Canal #5	RGB		Personnage Left-Of-Center (Protagonist)
Canal #28	RGB		Personnage Right-Of-Center (Interlocutor)


## Serial Protocol
This is the internal Tempête Serial protocol

```l1=255```
Light #1 value = 255

```l1=0```
Light #1 value = 0

```l28=on```
Light #28 value = 255

```l28=off```
Light #28 value = 0


### Fiche Technique Robe T11
- <https://robelighting.fr/res/downloads/dmx_charts/Robin_T11_Profile_PC_Fresnel_DMX_charts.pdf>


### DMX Protocol
- Mode 2 / 8-bit CMY/RGB 
- Current cannals
	- 5 + (below)
	- 28 + (below)
- Mode 2 values
+ 05 | 28	: 0 	Power/Special Function (IGNORE)
+ 06 | 29	: 0 	Color Functions
			- 0				No Function
			- 45 > 49		Color Mixing Mode RGB
+ 07 | 30	: 0 	CRI Selection 	(CRI = Color Rendering Index)
+ 08 | 31	: 0-255	Cyan / Red		(Default 255 if in RGB mode, i.e. all 255 == WHITE)
+ 09 | 32	: 0-255	Magenta / Green	(Default 255 if in RGB mode, i.e. all 255 == WHITE)
+ 10 | 33	: 0-255	Yellow / Blue	(Default 255 if in RGB mode, i.e. all 255 == WHITE)
+ 11 | 34	: 110		Color Temperature correction (CTT)
+ 12 | 35	: 32	Shutter / Strobe
+ 13 | 36	: 0-255	Dimmer Intensity

> Factory display menu setting: Colour mixing mode-CMY, Dimmer Curve-Square Law, Tungsten effect simulation-Off, Chromatic white- Off, Light output stability-Off, Uniformity-Off


## TODO
- Créer une scène "1" (?) qui est l'état par défaut lorsqu'il n'y a plus de lumière particulière
- Corriger les espacements pendant l'acte