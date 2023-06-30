from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from .models import Question, Option
import random

def quiz(request):
	return render(request, 'index.html')

def get_questions(request):
	question = Question.objects.order_by('?')
	count = Question.objects.count()
	questions = []
	for _ in range(10):
		questions.append(random_question(count))
	
	return JsonResponse(questions, safe=False)

def random_question(max):
    question = None

    while question is None:
        random_id = random.randint(1, max)
        try:
            question = Question.objects.get(id=random_id)
        except Question.DoesNotExist:
            pass
    
    options = Option.objects.filter(question=question)

    options_data = []
    for option in options:
        options_data.append(option.text)

    return {'question':question.question, 'answer':question.answer, 'options': options_data}

