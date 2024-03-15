```python
!brew install xpdf
!pip3 install pdf2image python-poppler poppler-utils Pillow pytesseract openai

import pdf2imag
from PIL import Image
import pytesseract
import os
from openai import OpenAI
import sys

  

client = OpenAI (api_key='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')

  

n = len (sys.argv)
folder = ""
pdf = sys.argv[1] if n > 1 else "virtual.pdf"
print (pdf)

  

image = pdf2image.convert_from_path(pdf)
for pagenumber, page in enumerate(image):
detected_text = pytesseract.image_to_string(page)
print (detected_text)

  

query = "please resume the ten most important concepts on this book and make a song of three verses and one chorus"

user_msg = detected_text + "\n\n" + query
system_msg = "you are a musicologist, and a songwriting composer"

  

response = client.chat.completions.create (model ="gpt-3.5-turbo",
messages= [
{"role": "system", "content": system_msg},
{"role": "user", "content": user_msg},
])

print(response.choices[0].message.content)
```