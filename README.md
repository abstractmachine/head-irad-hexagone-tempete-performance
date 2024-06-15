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

## TODO
- Créer une scène "1" (?) qui est l'état par défaut lorsqu'il n'y a plus de lumière particulière
