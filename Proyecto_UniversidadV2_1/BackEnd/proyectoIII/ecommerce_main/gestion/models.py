from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class admin_user(models.Model):
	name=models.CharField(max_length=100)
	lastname=models.CharField(max_length=100)
	email=models.CharField(max_length=100)

