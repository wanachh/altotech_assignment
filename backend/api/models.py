from django.db import models
from django.utils import timezone


class Machine(models.Model):
    # Think of this as your standard EF Core Model
    name = models.CharField(max_length=50)
    machine_type = models.CharField(
        max_length=50
    )  # e.g., 'Large AC', 'Small AC', 'Ventilation'
    zone = models.CharField(max_length=100)
    rated_power_kw = models.FloatField()

    def __str__(self):
        return self.name


class SensorReading(models.Model):
    # This will be our TimescaleDB Hypertable
    timestamp = models.DateTimeField(default=timezone.now)
    machine = models.ForeignKey(
        Machine, on_delete=models.CASCADE, related_name="readings"
    )
    power_kw = models.FloatField()
    temperature = models.FloatField(null=True, blank=True)
    speed_percent = models.FloatField(null=True, blank=True)
    is_on = models.BooleanField(default=False)

    class Meta:
        # Crucial for TimescaleDB indexing
        indexes = [
            models.Index(fields=["timestamp", "machine"]),
        ]


class AIDecision(models.Model):
    timestamp = models.DateTimeField(default=timezone.now)
    machine = models.ForeignKey(
        Machine, on_delete=models.CASCADE, related_name="ai_decisions"
    )
    action_type = models.CharField(max_length=50)  # 'TURN ON', 'TURN OFF', 'SET TEMP'
    reason = models.TextField()

    class Meta:
        indexes = [
            models.Index(fields=["timestamp"]),
        ]
