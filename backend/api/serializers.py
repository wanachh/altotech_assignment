# backend/api/serializers.py
from rest_framework import serializers
from .models import Machine, SensorReading, AIDecision


class MachineSerializer(serializers.ModelSerializer):
    """Serializer for the Machine model"""
    readings_count = serializers.SerializerMethodField()

    class Meta:
        model = Machine
        fields = [
            'id',
            'name',
            'machine_type',
            'zone',
            'rated_power_kw',
            'readings_count'
        ]
        read_only_fields = ['id', 'readings_count']

    def get_readings_count(self, obj):
        """Count the number of readings for this machine"""
        return obj.readings.count()


class SensorReadingSerializer(serializers.ModelSerializer):
    """Serializer for the SensorReading model"""
    machine_name = serializers.CharField(source="machine.name", read_only=True)
    machine_id = serializers.IntegerField(source="machine.id", read_only=True)

    class Meta:
        model = SensorReading
        fields = [
            'id',
            'timestamp',
            'machine',
            'machine_id',
            'machine_name',
            'power_kw',
            'temperature',
            'speed_percent',
            'is_on'
        ]
        read_only_fields = ['id', 'machine_id', 'machine_name']


class AIDecisionSerializer(serializers.ModelSerializer):
    """Serializer for the AIDecision model"""
    machine_name = serializers.CharField(source="machine.name", read_only=True)
    machine_id = serializers.IntegerField(source="machine.id", read_only=True)

    class Meta:
        model = AIDecision
        fields = [
            'id',
            'timestamp',
            'machine',
            'machine_id',
            'machine_name',
            'action_type',
            'reason'
        ]
        read_only_fields = ['id', 'machine_id', 'machine_name']