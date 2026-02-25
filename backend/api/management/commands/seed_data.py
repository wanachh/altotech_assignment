import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import Machine, SensorReading, AIDecision


class Command(BaseCommand):
    help = "Seeds the database with 7 days of simulated HVAC data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Clearing old data...")
        Machine.objects.all().delete()

        self.stdout.write("Creating Machines...")
        machines_data = [
            {"name": "AC-L1", "type": "Large AC", "zone": "Zone A", "power": 45},
            {"name": "AC-L2", "type": "Large AC", "zone": "Zone B", "power": 45},
            {"name": "AC-S1", "type": "Small AC", "zone": "Floor 1", "power": 12},
            {"name": "FAN-01", "type": "Ventilation", "zone": "Basement", "power": 5.5},
        ]

        machines = []
        for data in machines_data:
            machine = Machine.objects.create(
                name=data["name"],
                machine_type=data["type"],
                zone=data["zone"],
                rated_power_kw=data["power"],
            )
            machines.append(machine)

        self.stdout.write(
            "Generating 7 days of sensor data (this might take a few seconds)..."
        )
        end_time = timezone.now()
        start_time = end_time - timedelta(days=7)

        current_time = start_time
        readings = []
        decisions = []

        # Loop through every 5 minutes for 7 days
        while current_time <= end_time:
            # Days 1-3 are "Manual" (higher energy), Days 4-7 are "AI" (lower energy)
            days_passed = (current_time - start_time).days
            is_ai_period = days_passed >= 3

            hour = current_time.hour
            is_active_hours = 6 <= hour <= 22

            for machine in machines:
                is_on = is_active_hours

                # AI period optimizations: randomly turn off small ACs to save power
                if (
                    is_ai_period
                    and machine.machine_type == "Small AC"
                    and random.random() < 0.2
                ):
                    is_on = False

                # Calculate power (Manual uses more power than AI period)
                power_draw = 0
                if is_on:
                    base_power = machine.rated_power_kw * random.uniform(0.5, 0.8)
                    power_draw = base_power * (
                        0.85 if is_ai_period else 1.0
                    )  # 15% savings during AI

                readings.append(
                    SensorReading(
                        timestamp=current_time,
                        machine=machine,
                        power_kw=round(power_draw, 2),
                        temperature=(
                            round(random.uniform(23.0, 26.0), 1)
                            if is_on
                            else round(random.uniform(26.0, 29.0), 1)
                        ),
                        is_on=is_on,
                    )
                )

                # Generate AI Decisions during AI period
                if is_ai_period and len(decisions) < (
                    days_passed * 10
                ):  # roughly 10 per day
                    if hour == 6 and current_time.minute == 0:
                        decisions.append(
                            AIDecision(
                                timestamp=current_time,
                                machine=machine,
                                action_type="TURN ON",
                                reason="Morning startup sequence",
                            )
                        )
                    elif (
                        hour == 12
                        and current_time.minute == 30
                        and machine.machine_type == "Large AC"
                    ):
                        decisions.append(
                            AIDecision(
                                timestamp=current_time,
                                machine=machine,
                                action_type="SET TEMP",
                                reason="Peak occupancy, adjusting cooling",
                            )
                        )

            current_time += timedelta(minutes=5)

        # Bulk create for fast database insertion
        SensorReading.objects.bulk_create(readings)
        AIDecision.objects.bulk_create(decisions)

        self.stdout.write(self.style.SUCCESS("Successfully seeded the database!"))
