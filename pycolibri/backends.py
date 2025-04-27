from django.contrib.auth.backends import BaseBackend
from .models import Client


class ClientAuthBackend(BaseBackend):
    def authenticate(self, request, phonenum=None, phonecode=None):
        try:
            return Client.objects.get(phonenum=phonenum, phonecode=phonecode)
        except Client.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return Client.objects.get(pk=user_id)
        except Client.DoesNotExist:
            return None
