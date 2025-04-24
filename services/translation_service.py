from googletrans import Translator

class TranslationService:
    def __init__(self):
        self.translator = Translator()

    def translate(self, text, target_language):
        try:
            translation = self.translator.translate(text, dest=target_language)
            return translation.text
        except Exception as e:
            print(f"Translation error: {str(e)}")
            return text 