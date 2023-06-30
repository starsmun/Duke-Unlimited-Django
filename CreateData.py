import os
import csv
import django


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "forex.settings")
django.setup()

from Duke.models import Question, Option

with open('Questions.txt', 'r') as f:
	reader = csv.reader(f, delimiter=';')

	for row in reader:
		question_text = row[0]
		options_text = row[1:5]  
		answer_text = row[5]  

		question = Question.objects.create(question=question_text,answer=answer_text)

		for option_text in options_text:
			option = Option.objects.create(question=question, text=option_text)