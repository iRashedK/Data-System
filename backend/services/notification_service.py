class NotificationService:
    async def send_welcome_email(self, email: str, name: str):
        return

    async def send_account_locked_email(self, email: str):
        return

    async def send_high_risk_alert(self, email: str, filename: str, count: int):
        return

    async def get_active_alerts(self, user_id: str):
        return []

    async def send_service_alert(self, service: str, status):
        return
