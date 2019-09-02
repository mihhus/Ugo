//
//  FirstViewController.swift
//  Ugo
//
//  Created by KoheiOgawa on 2019/08/31.
//  Copyright © 2019 KoheiOgawa. All rights reserved.
//

import UIKit
import Firebase
import CoreLocation

class FirstViewController: UIViewController {

    
    var rootRef:DatabaseReference!
    
    @IBOutlet weak var cartenStatusLabel: UILabel!
    var getStatusdata = "0"
    var nextStatus = "0"

    @IBAction func switchButton_TouchUpInside(_ sender: Any) {
        switch self.getStatusdata{
        case "0":
            self.switchButton.setImage(UIImage(named:"switch_on.png"), for: .normal)
            nextStatus = "1"
            cartenStatusLabel.text = "雨の心配はありませんか...？"
            
        case "1":
            self.switchButton.setImage(UIImage(named:"switch_off.png"), for: .normal)
            nextStatus = "0"
            cartenStatusLabel.text = "洗濯物御守り中...."
            
        default:
            print("default:",self.getStatusdata)
            print("文字列型の0と1以外の値がにデータベースに入っています")
        }
        
        let formatter = DateFormatter()
        formatter.dateFormat = DateFormatter.dateFormat(fromTemplate: "dkHms", options: 0, locale: Locale.current)?.replacingOccurrences(of: ", ", with: ":")

        let timestampValue = formatter.string(from: Date())
        print(timestampValue)
        let writeValue = ["isClose":nextStatus,"timestamp":timestampValue]
        rootRef.child("device/smartphone").setValue(writeValue)
    }
    @IBOutlet weak var switchButton: UIButton!
    @IBOutlet weak var cartenControllerButton: UIButton!
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        
        //Firebaseの初期設定
        rootRef = Database.database().reference()
        
        rootRef.child("status").observe(DataEventType.value, with: { (snapshot) in
            // Get user value
            let value = snapshot.value as? NSDictionary
            self.getStatusdata = value?["isClose"] as? String ?? ""
            print("DEBUG:",self.getStatusdata)

            switch self.getStatusdata{
                case "0"://開いている状態のとき、閉じるボタン
                    self.switchButton.setImage(UIImage(named:"switch_off.png"), for: .normal)
                    self.cartenStatusLabel.text = "雨の心配はありませんか...？"
                case "1"://閉じている状態のとき、開けれるボタン
                    self.switchButton.setImage(UIImage(named:"switch_on.png"), for: .normal)
                    self.cartenStatusLabel.text = "洗濯物御守り中...."
                default:
                    print("default:",self.getStatusdata)
                    print("文字列型の0と1以外の値がにデータベースに入っています")
            }
            //self.TextField.text = getStatusdata
            //現在のカーテンの状態をセット
           // self.curtenStatement.selectedSegmentIndex = Int(getStatusdata)!
            
        }) { (error) in
            print(error.localizedDescription)
        }

        
    }
    
    @IBOutlet weak var label: UILabel!
    





    
}
    


