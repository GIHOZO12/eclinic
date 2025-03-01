from rest_framework import  serializers
from caredash.models import SymptomReport,Notification,User,Home


class SymptomReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = SymptomReport
        fields = ["id", "user", "symptoms", "location", "created_at"]
        extra_kwargs = {
            "id": {"read_only": True},
            "user": {"required": True},  # Assuming user should be provided
            "created_at": {"read_only": True},
        }
    
    def create(self, validated_data):
        user = validated_data.pop('user', None)  # Adjust based on how you handle user
        symptom_report = SymptomReport.objects.create(user=user, **validated_data)
        return symptom_report
    



class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields=["id","receipients","message","sent_at"]
        extra_kwargs = {"id":{"read_only":True},"sent_at":{"read_only":True},"receipients":{"required":True}}
        def create(self, validated_data):
            notification = Notification.objects.create(**validated_data)
            return notification



# class HomeinfoSerializer(serializers.ModelSerializer):
#       class Meta:
#         model = Homeinfo
#         fields = ["id","title","image"]
#         extra_kwargs = {"id":{"read_only":True}}






class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username","email","name","last_name","phone_number","location","profile_pic"]
        extra_kwargs = {"id":{"read_only":True},"location":{"required":False},"profile_pic":{"required":False}}




class HomeSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()  # Add this line

    class Meta:
        model = Home
        fields = ["id", "title", "image"]
        extra_kwargs = {"id": {"read_only": True}}

    def get_image(self, obj):
        # Build the full URL for the image
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None



