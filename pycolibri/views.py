from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import User, Profile, Dish, Meal, Portion, WeightResult, Feedback, BlogPost
from .serializers import (
    UserSerializer, ProfileSerializer, DishSerializer,
    MealSerializer, PortionSerializer, WeightResultSerializer,
    FeedbackSerializer, BlogPostSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Profile, user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DishViewSet(viewsets.ModelViewSet):
    serializer_class = DishSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Dish.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False)
    def mine(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class MealViewSet(viewsets.ModelViewSet):
    serializer_class = MealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Meal.objects.filter(user=self.request.user).order_by('-datetime')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_portion(self, request, pk=None):
        meal = self.get_object()
        serializer = PortionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(meal=meal)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PortionViewSet(viewsets.ModelViewSet):
    serializer_class = PortionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Portion.objects.filter(meal__user=self.request.user)

    def perform_destroy(self, instance):
        meal = instance.meal
        instance.delete()
        meal.save()  # Обновим калории приёма пищи


class WeightResultViewSet(viewsets.ModelViewSet):
    serializer_class = WeightResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WeightResult.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Feedback.objects.filter(user=self.request.user).order_by('-sent_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'url'