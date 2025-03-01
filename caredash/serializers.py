from rest_framework import serializers

class SymptomInputSerializer(serializers.Serializer):
    symptoms = serializers.ListField(
        child=serializers.CharField(), 
        allow_empty=False, 
        help_text="List of symptoms"
    )
