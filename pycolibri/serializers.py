from rest_framework import serializers
from .models import User, Profile, Dish, Meal, Portion, WeightResult, Feedback, BlogPost


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'phone_code', 'phone_num', 'first_name', 'last_name']
        extra_kwargs = {
            'phone_num': {'validators': []},  # Отключаем проверку уникальности при обновлении
        }


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'
        read_only_fields = ['user']


class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = '__all__'
        read_only_fields = ['user']


class MealSerializer(serializers.ModelSerializer):
    total_calories = serializers.SerializerMethodField()

    class Meta:
        model = Meal
        fields = '__all__'
        read_only_fields = ['user']

    def get_total_calories(self, obj):
        return sum(
            portion.dish.calories * portion.weight / 100
            for portion in obj.portions.all()
        )


class PortionSerializer(serializers.ModelSerializer):
    dish_details = DishSerializer(source='dish', read_only=True)

    class Meta:
        model = Portion
        fields = '__all__'
        read_only_fields = ['meal']


class WeightResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeightResult
        fields = '__all__'
        read_only_fields = ['user']


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ['user', 'sent_at']


class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = '__all__'