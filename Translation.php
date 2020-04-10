<?php

class Translation
{
    private $phrases;

    function __construct()
    {
        $this->phrases = [
            "TITLE" => ["404 | Page not found", "404 | Seite nicht gefunden"]
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
}
