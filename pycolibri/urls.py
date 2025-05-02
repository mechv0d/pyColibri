from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AuthViewSet, ProfileViewSet, DishViewSet,
    MealViewSet, PortionViewSet, WeightResultViewSet,
    FeedbackViewSet, BlogPostViewSet, IntermediateResultViewSet
)

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='pycolibri_db')
router.register(r'profiles', ProfileViewSet, basename='profile')
router.register(r'dishes', DishViewSet, basename='dish')
router.register(r'meals', MealViewSet, basename='meal')
router.register(r'portions', PortionViewSet, basename='portion')
router.register(r'weights', WeightResultViewSet, basename='weight')
router.register(r'feedback', FeedbackViewSet, basename='feedback')
router.register(r'blog', BlogPostViewSet, basename='blog')
router.register(r'results', IntermediateResultViewSet, basename='result')

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
