# backend/api/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta
from .models import Machine, SensorReading, AIDecision
from .serializers import MachineSerializer, AIDecisionSerializer, SensorReadingSerializer


class MachineViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Machine objects - supports full CRUD operations:
    - GET /api/machines/ - List all machines
    - POST /api/machines/ - Create new machine
    - GET /api/machines/{id}/ - Get specific machine
    - PUT /api/machines/{id}/ - Update machine
    - DELETE /api/machines/{id}/ - Delete machine
    - GET /api/machines/{id}/readings/ - Get all readings for a machine
    - GET /api/machines/{id}/ai-decisions/ - Get AI decisions for a machine
    """
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer

    @action(detail=True, methods=['get'])
    def readings(self, request, pk=None):
        """Get all sensor readings for a specific machine"""
        machine = self.get_object()
        readings = machine.readings.all().order_by('-timestamp')
        serializer = SensorReadingSerializer(readings, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def latest_reading(self, request, pk=None):
        """Get the latest sensor reading for a machine"""
        machine = self.get_object()
        latest = machine.readings.order_by('-timestamp').first()
        if latest:
            serializer = SensorReadingSerializer(latest)
            return Response(serializer.data)
        return Response({'detail': 'No readings found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'])
    def ai_decisions(self, request, pk=None):
        """Get all AI decisions for a specific machine"""
        machine = self.get_object()
        decisions = machine.ai_decisions.all().order_by('-timestamp')
        serializer = AIDecisionSerializer(decisions, many=True)
        return Response(serializer.data)


class SensorReadingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for SensorReading objects - supports full CRUD operations:
    - GET /api/sensor-readings/ - List all readings
    - POST /api/sensor-readings/ - Create new reading
    - GET /api/sensor-readings/{id}/ - Get specific reading
    - PUT /api/sensor-readings/{id}/ - Update reading
    - DELETE /api/sensor-readings/{id}/ - Delete reading
    """
    queryset = SensorReading.objects.all().order_by('-timestamp')
    serializer_class = SensorReadingSerializer

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get the 100 most recent sensor readings across all machines"""
        readings = self.queryset[:100]
        serializer = self.get_serializer(readings, many=True)
        return Response(serializer.data)


class AIDecisionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for AIDecision objects - supports full CRUD operations:
    - GET /api/ai-decisions/ - List all decisions
    - POST /api/ai-decisions/ - Create new decision
    - GET /api/ai-decisions/{id}/ - Get specific decision
    - PUT /api/ai-decisions/{id}/ - Update decision
    - DELETE /api/ai-decisions/{id}/ - Delete decision
    """
    queryset = AIDecision.objects.all().order_by('-timestamp')
    serializer_class = AIDecisionSerializer

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get the 100 most recent AI decisions"""
        decisions = self.queryset[:100]
        serializer = self.get_serializer(decisions, many=True)
        return Response(serializer.data)


class BuildingSummaryView(APIView):
    """
    Custom endpoint for building-wide summary statistics.
    This is a read-only view that aggregates data from all machines.
    """
    def get(self, request):
        latest_readings = []
        machines = Machine.objects.all()

        for m in machines:
            latest = m.readings.order_by('-timestamp').first()
            if latest:
                latest_readings.append(latest)

        total_power = sum(r.power_kw for r in latest_readings)
        active_machines = sum(1 for r in latest_readings if r.is_on)
        avg_temp = (sum(r.temperature for r in latest_readings if r.temperature) /
                   len(latest_readings) if latest_readings else 0)

        return Response({
            'total_power_kw': round(total_power, 2),
            'active_machines': active_machines,
            'average_temperature': round(avg_temp, 1),
            'total_machines': machines.count()
        })


class EnergyComparisonView(APIView):
    """
    Custom endpoint for energy comparison between manual and AI periods.
    This is a read-only view that analyzes historical data.
    """
    def get(self, request):
        end_time = timezone.now()
        start_time = end_time - timedelta(days=7)
        mid_time = start_time + timedelta(days=3)

        manual_period = SensorReading.objects.filter(
            timestamp__gte=start_time, timestamp__lt=mid_time
        )
        ai_period = SensorReading.objects.filter(
            timestamp__gte=mid_time, timestamp__lte=end_time
        )

        manual_kwh = sum(r.power_kw for r in manual_period) * (5/60)
        ai_kwh = sum(r.power_kw for r in ai_period) * (5/60)

        return Response({
            'manual_period_kwh': round(manual_kwh, 2),
            'ai_period_kwh': round(ai_kwh, 2),
            'savings_percent': round(
                ((manual_kwh - ai_kwh) / manual_kwh) * 100, 1
            ) if manual_kwh > 0 else 0
        })


class AILogsView(APIView):
    """
    Custom endpoint for recent AI activity logs.
    Returns the most recent AI decisions across all machines.
    """
    def get(self, request):
        decisions = AIDecision.objects.all().order_by('-timestamp')[:100]
        serializer = AIDecisionSerializer(decisions, many=True)
        return Response(serializer.data)