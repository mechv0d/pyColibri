from rest_framework import viewsets, permissions
from rest_framework.exceptions import ValidationError

from .models import (
    Client, PycolibriProfile, PycolibriDish,
    PycolibriMeal, PycolibriPortion, PycolibriIntermediateResult,
    PycolibriFeedback, PycolibriBlogContent
)
from .serializers import (
    AuthSerializer, ProfileSerializer, DishSerializer,
    MealSerializer, PortionSerializer, WeightResultSerializer,
    FeedbackSerializer, BlogPostSerializer, IntermediateResultSerializer
)


class AuthViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = AuthSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'phonenum'

    def get_queryset(self):
        return Client.objects.all()


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = PycolibriProfile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Вручную проверяем, что переданный uid существует
        uid = serializer.validated_data.get('uid')
        if not Client.objects.filter(pk=uid.id).exists():
            raise ValidationError("Client with this ID does not exist")
        serializer.save()


class DishViewSet(viewsets.ModelViewSet):
    serializer_class = DishSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PycolibriDish.objects.all()
        # return PycolibriDish.objects.filter(uid=self.request.user.client)

    def perform_create(self, serializer):
        serializer.save(uid=serializer.validated_data.get('uid'))


class MealViewSet(viewsets.ModelViewSet):
    serializer_class = MealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PycolibriMeal.objects.all()

    def perform_create(self, serializer):
        serializer.save(uid=serializer.validated_data.get('uid'))


class PortionViewSet(viewsets.ModelViewSet):
    serializer_class = PortionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PycolibriPortion.objects.all()

    def perform_create(self, serializer):
        mid = serializer.validated_data.get('meal')
        did = serializer.validated_data.get('dish')
        print(mid, did)
        serializer.save(meal_id=mid.id,
                        dish_id=did.id)

    def perform_destroy(self, instance):
        meal = instance.meal
        instance.delete()
        meal.save()


class WeightResultViewSet(viewsets.ModelViewSet):
    serializer_class = WeightResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PycolibriIntermediateResult.objects.all()

    def perform_create(self, serializer):
        serializer.save(uid=serializer.validated_data.get('uid'))


class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PycolibriFeedback.objects.all()

    def perform_create(self, serializer):
        serializer.save(uid=serializer.validated_data.get('uid'))


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PycolibriBlogContent.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'url'


class IntermediateResultViewSet(viewsets.ModelViewSet):
    queryset = PycolibriIntermediateResult.objects.all()
    serializer_class = IntermediateResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Вручную проверяем, что переданный uid существует
        uid = serializer.validated_data.get('uid')
        if not Client.objects.filter(pk=uid.id).exists():
            raise ValidationError("Client with this ID does not exist")
        serializer.save()
