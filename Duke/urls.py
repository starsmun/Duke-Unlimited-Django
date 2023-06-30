from django.urls import path
from . import views

urlpatterns = [
	path('', views.quiz, name='quiz'),
	path('get_questions', views.get_questions, name='Get Questions')
]