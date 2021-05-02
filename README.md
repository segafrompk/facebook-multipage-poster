# facebook-multipage-poster
Multi page poster napravljen (od nule) za potrebe šerovanja linkova na veliki broj stranica, napravljen u kratkom roku jer je multipage posterkoji smo koristili prestao da radi. Nije lep, organizovan kod, ali je radio ono za sta je bio i napravljen :)

Facebook multipage poster funkcioniše tako što se prvo unese Facebook User Access Token (može se nabaviti preko linka na samoj stranici). Nakon toga stranica
izlista sve Facebook stranice kojima profil za koji je vezan token ima pristup kao urednik ili administrator. Moguće je postaviti caption i link koji će biti
poslati na selektovane stranice. Da bi se smanjila šansa da Facebook ovo prepozna kao spam, napravljen je razmak između 5 i 7 sekundi.
