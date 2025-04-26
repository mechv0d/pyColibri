# urls.py
from django.urls import path
from .views import (
    UserViewSet, 
    ProfileViewSet,
    DishViewSet,
    WeightResultViewSet,
    MealViewSet,
    PortionViewSet,
    FeedbackViewSet,
    BlogPostViewSet
)

urlpatterns = [
    # User endpoints
    path('users/', UserViewSet.as_view({
        'post': 'create',
        'get': 'list'
    })), 
    path('users/<int:pk>/', UserViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    })),

    # Profile endpoints
    path('profiles/', ProfileViewSet.as_view({
        'post': 'create'
    })),
    path('profiles/<int:user_id>/', ProfileViewSet.as_view({
        'get': 'retrieve',
        'put': 'update'
    })),

    # Dish endpoints
    path('dishes/', DishViewSet.as_view({
        'post': 'create'
    })),
    path('dishes/<int:pk>/', DishViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    })),
    path('users/<int:user_id>/dishes/', DishViewSet.as_view({
        'get': 'list_by_user'
    })),

    # Weight endpoints
    path('weights/', WeightResultViewSet.as_view({
        'post': 'create'
    })),
    path('users/<int:user_id>/weights/', WeightResultViewSet.as_view({
        'get': 'list_by_user'
    })),
    path('weights/<int:pk>/', WeightResultViewSet.as_view({
        'delete': 'destroy'
    })),

    # Meal endpoints
    path('meals/', MealViewSet.as_view({
        'post': 'create'
    })),
    path('meals/<int:pk>/', MealViewSet.as_view({
        'get': 'retrieve',
        'delete': 'destroy'
    })),
    path('users/<int:user_id>/meals/', MealViewSet.as_view({
        'get': 'list_by_user'
    })),

    # Portion endpoints
    path('portions/', PortionViewSet.as_view({
        'post': 'create'
    })),
    path('portions/<int:pk>/', PortionViewSet.as_view({
        'delete': 'destroy'
    })),
    path('meals/<int:meal_id>/portions/', PortionViewSet.as_view({
        'get': 'list_by_meal'
    })),

    # Feedback endpoints
    path('feedback/', FeedbackViewSet.as_view({
        'post': 'create'
    })),
    path('feedback/<int:pk>/', FeedbackViewSet.as_view({
        'get': 'retrieve'
    })),
    path('users/<int:user_id>/feedback/', FeedbackViewSet.as_view({
        'get': 'list_by_user'
    })),

    # Blog endpoints
    path('blog/', BlogPostViewSet.as_view({
        'get': 'list'
    })),
    path('blog/<int:pk>/', BlogPostViewSet.as_view({
        'get': 'retrieve'
    })),
]