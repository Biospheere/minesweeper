<?php

class Translation
{
    private $phrases;

    function __construct()
    {
        $this->phrases = [
            "TITLE" => ["404 | Page not found", "404 | Seite nicht gefunden"],
            "ERROR_MESSAGE_1" => ["A 404-Error occurred.", "Ein 404-Fehler ist aufgetreten."],
            "ERROR_MESSAGE_2" => ["The page is missing or was never meant to exist.", "Die Seite fehlt oder sollte nie existieren."]
        ];
    }

    public function Get($phraseWord)
    {
        $phrase = $this->phrases[$phraseWord];

        if (!isset($phrase)) {
            return $phraseWord;
        }

        if (LANG == "de") {
            return $phrase[1];
        } else {
            return $phrase[0];
        }
    }

    public function Out($phraseWord)
    {
        echo $this->Get($phraseWord);
    }
}
