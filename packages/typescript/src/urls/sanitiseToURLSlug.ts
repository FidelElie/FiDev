const INVALID_CHARS_EXCLUSION_REGEXP = /[^A-Za-z0-9\-]+/gi;

const CHAR_TO_TEXT_MAP = {
	$: "s",
	"&": "and",
	"@": "at",
	"*": "star",

	// Accented characters (diacritics)
	"à": "a",
  "á": "a",
  "â": "a",
  "ã": "a",
  "ä": "a",
  "å": "a",
  "æ": "ae",
  "ç": "c",
  "è": "e",
  "é": "e",
  "ê": "e",
  "ë": "e",
  "ì": "i",
  "í": "i",
  "î": "i",
  "ï": "i",
  "ð": "d",
  "ñ": "n",
  "ò": "o",
  "ó": "o",
  "ô": "o",
  "õ": "o",
  "ö": "o",
  "ø": "o",
  "ù": "u",
  "ú": "u",
  "û": "u",
  "ü": "u",
  "ý": "y",
  "þ": "th",
  "ÿ": "y",

	// Accented capital letters
	"À": "A",
  "Á": "A",
  "Â": "A",
  "Ã": "A",
  "Ä": "A",
  "Å": "A",
  "Æ": "AE",
  "Ç": "C",
  "È": "E",
  "É": "E",
  "Ê": "E",
  "Ë": "E",
  "Ì": "I",
  "Í": "I",
  "Î": "I",
  "Ï": "I",
  "Ð": "D",
  "Ñ": "N",
  "Ò": "O",
  "Ó": "O",
  "Ô": "O",
  "Õ": "O",
  "Ö": "O",
  "Ø": "O",
  "Ù": "U",
  "Ú": "U",
  "Û": "U",
  "Ü": "U",
  "Ý": "Y",
  "Þ": "TH",
  "Ÿ": "Y",
}

export function sanitiseToURLSlug(fileName: string) {
	return fileName.split(" ").map(
		segment => {
			for (const [char, replacement] of Object.entries(CHAR_TO_TEXT_MAP)) {
				segment = segment.replaceAll(char, replacement);
			}

			segment = segment.replaceAll(INVALID_CHARS_EXCLUSION_REGEXP, "");

			return segment.toLowerCase().trim();
		}
	).filter(Boolean).join("-");
}
