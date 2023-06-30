from django.db import models

# Create your models here.

class Question(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.CharField(max_length=150)
    answer = models.CharField(max_length=150)

    class Meta:
        db_table = 'Question'
    
    def __str__(self):
        return f'{self.question}'

class Option(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=150)

    class Meta:
        db_table = 'Option'
    
    def __str__(self):
        return f'{self.text}'
