from rest_framework import serializers
from .models import (
    Client, PycolibriProfile, PycolibriDish,
    PycolibriMeal, PycolibriPortion, PycolibriIntermediateResult,
    PycolibriFeedback, PycolibriBlogContent, PycolibriIrStatisticItem
)


class AuthSerializer(serializers.ModelSerializer):
    # id = serializers.PrimaryKeyRelatedField(
    #     queryset=Client.objects.all(),
    #     required=True
    # )
    class Meta:
        model = Client
        fields = '__all__'
        extra_kwargs = {
            'phonenum': {'validators': []},
        }


class ProfileSerializer(serializers.ModelSerializer):
    uid = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(),
        required=True
    )

    class Meta:
        model = PycolibriProfile
        fields = '__all__'


class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = PycolibriDish
        fields = '__all__'


class MealSerializer(serializers.ModelSerializer):
    total_calories = serializers.SerializerMethodField()

    class Meta:
        model = PycolibriMeal
        fields = '__all__'
        # read_only_fields = ['uid']

    def get_total_calories(self, obj):
        return sum(
            portion.dish.ev_cal * portion.weight / 100
            for portion in obj.pycolibriportion_set.all()
        )


class PortionSerializer(serializers.ModelSerializer):
    dish_details = DishSerializer(source='dish', read_only=True)

    class Meta:
        model = PycolibriPortion
        fields = '__all__'
        # read_only_fields = ['meal']


class WeightResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = PycolibriIntermediateResult
        fields = '__all__'
        # read_only_fields = ['uid']


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = PycolibriFeedback
        fields = '__all__'
        # read_only_fields = ['uid', 'send_time']


class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = PycolibriBlogContent
        fields = '__all__'


class StatisticItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PycolibriIrStatisticItem
        fields = '__all__'
