import { useLanguage } from "@/contexts/language-context"
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"

export const OrderTimeline = () => {
    const { t } = useLanguage()

    return (<Card>
        <CardHeader>
            <CardTitle className="text-lg">{t("orders.orderTimeline")}</CardTitle>
            <CardDescription>{t("orders.trackProgress")}</CardDescription>
        </CardHeader>
        {/* <CardContent>
        <div className="space-y-4">
          {orderData!.timeline.map((step, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {step.completed ? (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${step.completed ? "text-gray-900" : "text-gray-500"}`}>
                  {step.status}
                </p>
                <p className="text-xs text-muted-foreground">{step.date}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent> */}
    </Card>
    )
}